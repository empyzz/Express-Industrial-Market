import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { getOrderDetail } from './orderController';
import { Prisma } from '../../prisma/.prisma/generated';
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
        const userId = res.locals.user?.id;
        if (!userId) {
            req.flash('error_msg', 'Sessão inválida.');
            return res.redirect('/auth/login');
        }

        const { name } = req.body;

        const dataToUpdate: Prisma.UserUpdateInput = {
            name,
        };

        const avatarFile = req.file;
        if (avatarFile) {
            dataToUpdate.avatar = `/uploads/images/${avatarFile.filename}`;
        }

        await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        });

        req.flash('success_msg', 'Seu perfil foi atualizado com sucesso!');
        res.redirect('/buyer/profile');

    } catch (error) {
        console.error("Erro ao atualizar perfil do comprador:", error);
        next(error);
    }
};
