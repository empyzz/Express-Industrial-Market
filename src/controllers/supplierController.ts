import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';


export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {

    if( res.locals.user == null){
        console.log("User dashboard null");
    }

    try {
        const company = res.locals.user?.company;
        const companyId = res.locals.user?.company.id;
        const [totalProducts, totalOrders, recentOrders] = await Promise.all([

            prisma.product.count({
                where: { supplierId: companyId }
            }),

            prisma.order.count({
                where: { supplierId: companyId }
            }),

            prisma.order.findMany({
                where: { supplierId: companyId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    buyer: {
                        select: { name: true }
                    }
                }
            })
        ]);

        // Calcular a receita total (exemplo simplificado)
        const revenueResult = await prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                supplierId: companyId,
                paymentStatus: 'APPROVED',
            },
        });
        const totalRevenue = revenueResult._sum.totalAmount || 0;


        res.render('supplier/dashboard', {
            title: 'Painel do Fornecedor',
            layout: 'layout/dashboard',
            company: company,
            stats: {
                totalProducts,
                totalOrders,
                totalRevenue
            },
            recentOrders,
        });

    } catch (error) {
        console.error("Erro ao carregar dashboard do fornecedor:", error);
        next(error); // Passa o erro para o error handler global
    }
};
