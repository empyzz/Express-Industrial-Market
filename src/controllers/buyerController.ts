import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { getOrderDetail } from './orderController';
export { getOrderDetail };

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user!.id;
        const recentOrders = await prisma.order.findMany({
            where: { buyerId: userId },
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        res.render('buyer/dashboard', {
            title: 'Painel do Comprador',
            layout: 'layout/dashboard-buyer',
            recentOrders
        });
    } catch (error) {
        next(error);
    }
};


export const getProfilePage = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = res.locals.user;

        const companyId = res.locals.user?.company?.id;
        const addresses = await prisma.address.findMany({
            where: { companyId: companyId }
        });

        res.render('buyer/profile', {   
            title: 'Meu Perfil',
            layout: 'layout/dashboard-buyer',
            user,
            addresses
        });
    } catch (error) {
        next(error);
    }
};


export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user!.id;
        const { name, email, phone } = req.body;

        await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                phone
            }
        });

        req.flash('success_msg', 'Perfil atualizado com sucesso!');
        res.redirect('/buyer/profile');

    } catch (error: unknown) {
        if (error === 'P2002' && error?.includes('email')) {
            req.flash('error_msg', 'Este e-mail já está em uso por outra conta.');
        } else {
            req.flash('error_msg', 'Ocorreu um erro ao atualizar o perfil.');
        }
        res.redirect('/buyer/profile');
    }
};
