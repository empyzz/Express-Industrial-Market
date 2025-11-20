import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

const PRODUCTS_PER_PAGE = 12; // Define quantos produtos mostrar por página

export const getCatalog = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const page = parseInt(req.query.page as string) || 1;
        const categorySlug = req.query.category as string;
        const minPrice = parseFloat(req.query.minPrice as string) || undefined;
        const maxPrice = parseFloat(req.query.maxPrice as string) || undefined;
        const searchQuery = req.query.q as string;

        // --- Construção da Cláusula 'where' do Prisma ---
        let where: Prisma.ProductWhereInput = {
            isActive: true,
        };

        if (categorySlug) {
            where.category = { slug: categorySlug };
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = minPrice; // gte = Greater Than or Equal
            if (maxPrice) where.price.lte = maxPrice; // lte = Less Than or Equal
        }

        if (searchQuery) {
            where.OR = [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
            ];
        }

        // --- Consultas ao Banco de Dados em Paralelo ---
        const [products, totalProducts, categories] = await Promise.all([
            prisma.product.findMany({
                where,
                skip: (page - 1) * PRODUCTS_PER_PAGE,
                take: PRODUCTS_PER_PAGE,
                orderBy: { createdAt: 'desc' },
                include: {
                    images: { take: 1, orderBy: { order: 'asc' } },
                    supplier: {
                        select: {
                            nomeFantasia: true
                        }
                    }
                }
            }),
            prisma.product.count({ where }),
            prisma.category.findMany({ orderBy: { name: 'asc' } })
        ]);

        const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

        res.render('catalog/catalog', {
            title: 'Catálogo de Produtos',
            layout: 'layout/main',
            products,
            categories,
            currentPage: page,
            totalPages,
            totalProducts,
            filters: {
                category: categorySlug,
                minPrice,
                maxPrice,
                q: searchQuery
            }
        });

    } catch (error) {
        console.error("Erro ao carregar o catálogo:", error);
        next(error);
    }
};
