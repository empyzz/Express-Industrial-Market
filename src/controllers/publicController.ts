import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';


export const getIndexPage = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const company = await prisma.company.findMany({
            where: {
                isActive: true
            }
        })


        const users = await prisma.user.findMany({
            where: {
                isActive: true
            }
        })

        const featuredProducts = await prisma.product.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 8,
            include: {
                images: {
                    take: 1,
                    orderBy: { order: 'asc' }
                },
                supplier: {
                    select: { nomeFantasia: true }
                }
            }
        });

        res.render('index', {
            title: 'Página Inicial',
            layout: 'layout/main',
            products: featuredProducts,
            company: company,
            users: users,
        });

    } catch (error) {
        console.error("Erro ao carregar a página inicial:", error);
        next(error);
    }
};


export const getSupplierProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { isOwner } = res.locals;
        
        if (!id || typeof id !== 'string') {
            req.flash('error_msg', 'ID de fornecedor inválido.');
            return res.redirect('/');
        }

        const company = await prisma.company.findFirst({
            where: { 
                id: id,        
                isActive: true 
            },
            include: {
                address: true,
                
                products: { 
                    where: { isActive: true },
                    take: 12,
                    orderBy: { createdAt: 'desc' },
                    include: { images: { take: 1 } }
                },
                reviews: { 
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: { buyer: { select: { name: true } } }
                }
            }
        });

        if (!company) {
            req.flash('error_msg', 'Fornecedor não encontrado ou inativo.');
            return res.redirect('/');
        }

        res.render('public/supplier-profile', {
            title: company.nomeFantasia || company.razaoSocial,
            layout: 'layout/main', 
            company,
            isOwner
        });

    } catch (error) {
        console.error("Erro ao carregar perfil do fornecedor:", error);
        next(error);
    }
};


export const handleSearch = (req: Request, res: Response) => {
    const searchQuery = req.query.q as string;

    if (!searchQuery || searchQuery.trim() === '') {
        return res.redirect('/catalog');
    }
    const params = new URLSearchParams();
    params.append('q', searchQuery.trim());

    res.redirect(`/catalog?${params.toString()}`);
};