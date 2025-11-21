import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';


export const getReviewChoicePage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const userId = res.locals.user?.id;

        if (userId == null || orderId == null){
            req.flash('error_msg', 'Usuario ou Pedido não encontrado.');
            return res.redirect('/auth/login');
        };

        const order = await prisma.order.findFirst({
            where: { id: orderId, buyerId: userId, status: 'DELIVERED' },
            include: {
                items: {
                    include: {
                        product: { select: { name: true } },
                        review: { select: { id: true } } 
                    }
                }
            }
        });

        if (!order) {
            req.flash('error_msg', 'Pedido não encontrado ou não pode ser avaliado.');
            return res.redirect('/buyer/orders');
        }

        res.render('buyer/review-choice', {
            title: 'Avaliar Itens do Pedido',
            layout: 'layout/dashboard-buyer',
            order
        });
    } catch (error) {
        next(error);
    }
};

export const getReviewForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { itemId } = req.params;
        const userId = res.locals.user?.id;

        if (userId == null || itemId == null){
            req.flash('error_msg', 'Usuario ou Pedido não encontrado.');
            return res.redirect('/auth/login');
        };

        const orderItem = await prisma.orderItem.findFirst({
            where: {
                id: itemId,
                order: { buyerId: userId, status: 'DELIVERED' },
                review: null
            },
            include: {
                product: { select: { name: true } },
                order: {
                    select: {
                        orderNumber: true,
                        supplier: {
                            select: {
                                nomeFantasia: true
                            }
                        }
                    }
                }
            }
        });

        if (!orderItem) {
            req.flash('error_msg', 'Este item não pode ser avaliado.');
            return res.redirect('/buyer/orders');
        }

        res.render('buyer/review-form', {
            title: `Avaliar ${orderItem.productName}`,
            layout: 'layout/dashboard-buyer',
            item: orderItem
        });
    } catch (error) {
        next(error);
    }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { itemId } = req.params;
        const userId = res.locals.user?.id;
        const { rating, comment } = req.body;

        if (userId == null || itemId == null){
            req.flash('error_msg', 'Usuario ou Pedido não encontrado.');
            return res.redirect('/auth/login');
        };


        const orderItem = await prisma.orderItem.findFirst({
            where: { id: itemId, order: { buyerId: userId }, review: null },
            include: { order: true }
        });

        if (!orderItem) { 
            req.flash('error_msg', 'Item não existe.');
            return res.redirect('/');
        }

        await prisma.$transaction(async (tx) => {

            await tx.review.create({
                data: {
                    rating: parseInt(rating, 10),
                    comment,
                    buyer:   { connect: { id: userId } },
                    company: { connect: { id: orderItem.order.supplierId } },
                    product: { connect: { id: orderItem.productId! } },
                    order:   { connect: { id: orderItem.orderId } }
                }
            });

            // 2. Recalcula e atualiza as estatísticas da EMPRESA
            const companyStats = await tx.review.aggregate({
                where: { companyId: orderItem.order.supplierId, isApproved: true },
                _avg: { rating: true },
                _count: { id: true }
            });
            await tx.company.update({
                where: { id: orderItem.order.supplierId },
                data: {
                    ratingAverage: companyStats._avg.rating || 0,
                    ratingCount:   companyStats._count.id || 0
                }
            });
        });

        req.flash('success_msg', 'Sua avaliação foi enviada com sucesso!');
        res.redirect(`/buyer/orders/${orderItem.orderId}`);
    } catch (error) {
        next(error);
    }
};