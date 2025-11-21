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
        next(error);
    }
};


export const getEditProfileForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = res.locals.user?.company?.id;

        if (!companyId) {
            req.flash('error_msg', 'Empresa não encontrada.');
            return res.redirect('/supplier/dashboard');
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: { address: true }
        });

        if (!company) {
            req.flash('error_msg', 'Não foi possível carregar os dados da sua empresa.');
            return res.redirect('/supplier/dashboard');
        }

        res.render('public/edit-profile', {
            title: 'Editar Perfil da Loja',
            layout: 'layout/dashboard',
            company
        });
    } catch (error) {
        next(error);
    }
};


export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = res.locals.user?.company?.id;

        if (!companyId) {
            req.flash('error_msg', 'Sessão inválida. Por favor, faça login novamente.');
            return res.redirect('/auth/login');
        }

        const {
            razaoSocial,
            nomeFantasia,
            phone,
            email,
            website,
            description,
            logo,
            banner
        } = req.body;


        await prisma.company.update({
            where: { id: companyId },
            data: {
                razaoSocial,
                nomeFantasia,
                phone,
                email,
                website: website || null,
                description: description || null,
                logo: logo || null,
                banner: banner || null
            }
        });

        req.flash('success_msg', 'Perfil da loja atualizado com sucesso!');
        res.redirect('/supplier/profile/edit');

    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        req.flash('error_msg', 'Ocorreu um erro ao salvar as alterações.');
        next(error);
    }
};
