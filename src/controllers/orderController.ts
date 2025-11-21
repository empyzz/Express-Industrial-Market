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
