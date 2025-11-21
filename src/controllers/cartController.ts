import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from "@prisma/client"

export const addOrUpdateCartItem = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userId = res.locals.user?.id;

        if (userId == null) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { productId, quantity } = req.body;

 
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'ID do produto e quantidade são obrigatórios.' });
        }

        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ message: 'Quantidade inválida.' });
        }

        let cart = await prisma.quotationCart.findUnique({
            where: { userId: userId }
        });

        if (!cart) {
            cart = await prisma.quotationCart.create({
                data: { userId: userId }
            });
        }

        const existingItem = await prisma.quotationCartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId
                }
            }
        });

        if (existingItem) {
            await prisma.quotationCartItem.update({
                where: { id: existingItem.id },
                data: { quantity: parsedQuantity }
            });
        } else {
            await prisma.quotationCartItem.create({
                data: {
                    cartId: cart.id,
                    productId: productId,
                    quantity: parsedQuantity
                }
            });
        }

        req.flash("Carrinho atualizado com sucesso!");
        return res.status(200).json({ message: "Carrinho atualizado com sucesso!" });

    } catch (error) {
        console.error("Erro ao atualizar carrinho:", error);
        return res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
    }
};


export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user?.id;

        if (userId == null) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const cart = await prisma.quotationCart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { take: 1, orderBy: { order: 'asc' } },
                                supplier: { select: { nomeFantasia: true } }
                            }
                        }
                    }
                }
            }
        });
        
        const cartItems = cart?.items || [];

        res.render('buyer/cart', {
            title: 'Meu Carrinho de Cotação',
            layout: 'layout/main',
            items: cartItems
        });

    } catch (error) {
        next(error);
    }
};


export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user?.id;
        const { id: itemId } = req.params;


        if (userId == null || itemId == null) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const item = await prisma.quotationCartItem.findFirst({
            where: {
                id: itemId,
                cart: { userId: userId }
            }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado ou não pertence a você.' });
        }

        await prisma.quotationCartItem.delete({
            where: { id: itemId }
        });

        req.flash('success_msg', 'Item removido com sucesso.');
        res.redirect('/buyer/cart');

    } catch (error) {
        next(error);
    }
};


export const getQuotationSendPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user?.id;

        if (userId == null) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const cart = await prisma.quotationCart.findUnique({
            where: { userId },
            include: { items: true }
        });

        if (!cart || cart.items.length === 0) {
            req.flash('error_msg', 'Seu carrinho de cotação está vazio.');
            return res.redirect('/buyer/cart');
        }

        res.render('buyer/send-quotation', {
            title: 'Revisar e Enviar Cotação',
            layout: 'layout/main',
            itemCount: cart.items.length
        });

    } catch (error) {
        next(error);
    }
};


export const createOrdersFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user?.id;
        const { buyerNotes } = req.body;

        if (userId == null) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const cart = await prisma.quotationCart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                supplierId: true,
                                stockQuantity: true
                            }
                        }
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            req.flash('error_msg', 'Seu carrinho está vazio.');
            return res.redirect('/buyer/cart');
        }

        const itemsBySupplier = new Map<string, any[]>();
        for (const item of cart.items) {
            const supplierId = item.product.supplierId;
            if (!itemsBySupplier.has(supplierId)) {
                itemsBySupplier.set(supplierId, []);
            }
            itemsBySupplier.get(supplierId)!.push(item);
        }

        await prisma.$transaction(async (tx) => {
            for (const [supplierId, items] of itemsBySupplier.entries()) {

                let totalAmount = 0;
                const orderItemsData = items.map(item => {
                    if (item.product.stockQuantity < item.quantity) {
                        throw new Error(`Estoque insuficiente para o produto: ${item.product.name}`);
                    }

                    const priceAsNumber = Number(item.product.price);
                    const itemTotal = priceAsNumber * item.quantity;
                    totalAmount += itemTotal;

                    return {
                        productId: item.product.id,
                        productName: item.product.name,
                        quantity: item.quantity,
                        unitPrice: item.product.price
                    };
                });

                const newOrder = await tx.order.create({
                    data: {
                        orderNumber: `PED-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
                        totalAmount: totalAmount,
                        paymentMethod: 'A_PRAZO',
                        status: 'PENDING',
                        buyerId: userId,
                        supplierId: supplierId,
                        items: {
                            create: orderItemsData
                        }
                    }
                });

                for (const item of items) {
                    await tx.product.update({
                        where: { id: item.product.id },
                        data: {
                            stockQuantity: {
                                decrement: item.quantity
                            }
                        }
                    });
                }
            }

            await tx.quotationCartItem.deleteMany({
                where: { cartId: cart.id }
            });
        });

        req.flash('success_msg', 'Sua solicitação de cotação foi enviada com sucesso e os pedidos foram criados!');
        res.redirect('/');

    } catch (error) {
        console.error("Erro ao criar pedidos a partir da cotação:", error);
        next(error);
    }
};