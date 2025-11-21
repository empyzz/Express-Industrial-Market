import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';


export const getOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const user = res.locals.user;


        if (user == null || orderId == null) {
            return res.redirect('/auth/login');
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, slug: true }
                        }
                    }
                },
                buyer: {
                    select: { name: true, email: true }
                },
                supplier: {
                    include: {
                        address: true
                    }
                },
                review: {
                    select: { id: true }
                }
            }
        });

        if (!order || (order.buyerId !== user.id && order.supplierId !== user.company?.id)) {
            req.flash('error_msg', 'Pedido não encontrado ou você não tem permissão para visualizá-lo.');
            const redirectPath = user.userType === 'BUYER' ? '/buyer/dashboard' : '/supplier/dashboard';
            return res.redirect(redirectPath);
        }

        const layout = user.userType === 'BUYER' ? 'layout/dashboard-buyer' : 'layout/dashboard';

        res.render('shared/order-detail', { 
            title: `Detalhes do Pedido #${order.orderNumber}`,
            layout: layout,
            order: order,
            isSupplier: user.userType === 'SUPPLIER' 
        });

    } catch (error) {
        next(error);
    }
};


export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const companyId = res.locals.user?.company?.id;

        if (orderId == null || companyId == null) {
            return res.redirect('/');
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                supplierId: companyId
            }
        });

        if (!order) {
            req.flash('error_msg', 'Pedido não encontrado ou você não tem permissão para alterá-lo.');
            return res.redirect('/supplier/dashboard');
        }
        if (order.status !== 'PENDING') {
            req.flash('error_msg', `Este pedido não pode ser confirmado pois seu status é "${order.status}".`);
            return res.redirect(`/supplier/orders/${orderId}`);
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CONFIRMED' }
        });

        req.flash('success_msg', `O pedido #${order.orderNumber} foi confirmado com sucesso!`);
        res.redirect(`/supplier/orders/${orderId}`);

    } catch (error) {
        next(error);
    }
};


export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const companyId = res.locals.user?.company?.id;

        if (orderId == null || companyId == null) {
            return res.redirect('/');
        }

        const order = await prisma.order.findFirst({
            where: { id: orderId, supplierId: companyId }
        });

        if (!order) {
            req.flash('error_msg', 'Pedido não encontrado ou você não tem permissão para alterá-lo.');
            return res.redirect('/supplier/dashboard');
        }
        if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
            req.flash('error_msg', `Este pedido não pode ser cancelado pois seu status é "${order.status}".`);
            return res.redirect(`/supplier/orders/${orderId}`);
        }


        if (order.status === 'CONFIRMED') {
            const orderItems = await prisma.orderItem.findMany({
                where: { orderId: order.id }
            });

            await prisma.$transaction(async (tx) => {
                for (const item of orderItems) {
                    await tx.product.update({
                        where: { id: item.productId! },
                        data: {
                            stockQuantity: {
                                increment: item.quantity
                            }
                        }
                    });
                }

                await tx.order.update({
                    where: { id: orderId },
                    data: { status: 'CANCELLED' }
                });
            });
        } else {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'CANCELLED' }
            });
        }

        req.flash('success_msg', `O pedido #${order.orderNumber} foi cancelado.`);
        res.redirect(`/supplier/orders/${orderId}`);

    } catch (error) {
        next(error);
    }
};


export const shipOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const companyId = res.locals.user?.company?.id;

        if (orderId == null || companyId == null) {
            return res.redirect('/');
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                supplierId: companyId
            }
        });

        if (!order) {
            req.flash('error_msg', 'Pedido não encontrado ou você não tem permissão para alterá-lo.');
            return res.redirect('/supplier/dashboard');
        }
        if (order.status !== 'CONFIRMED') {
            req.flash('error_msg', `Este pedido não pode ser marcado como enviado pois seu status é "${order.status}".`);
            return res.redirect(`/supplier/orders/${orderId}`);
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { 
                status: 'SHIPPED',
            }
        });

        req.flash('success_msg', `O pedido #${order.orderNumber} foi marcado como enviado!`);
        res.redirect(`/supplier/orders/${orderId}`);

    } catch (error) {
        next(error);
    }
};


export const deliveredOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const companyId = res.locals.user?.company?.id;

        if (orderId == null || companyId == null) {
            return res.redirect('/');
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                supplierId: companyId
            }
        });

        if (!order) {
            req.flash('error_msg', 'Pedido não encontrado ou você não tem permissão para alterá-lo.');
            return res.redirect('/supplier/dashboard');
        }
        if (order.status !== 'SHIPPED') {
            req.flash('error_msg', `Este pedido não pode ser marcado como enviado pois seu status é "${order.status}".`);
            return res.redirect(`/supplier/orders/${orderId}`);
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { 
                status: 'DELIVERED',
            }
        });

        req.flash('success_msg', `O pedido #${order.orderNumber} foi entregue!`);
        res.redirect(`/supplier/orders/${orderId}`);

    } catch (error) {
        next(error);
    }
};