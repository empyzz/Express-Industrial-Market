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
                { supplier: { nomeFantasia: { contains: searchQuery, mode: 'insensitive' } } } 
            ];
        }

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


export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            req.flash('error_msg', 'Produto não encontrado.');
            return res.redirect('/catalog');
        }

       const product = await prisma.product.findUnique({
            where: { 
                id: id,
                isActive: true
            },
            include: {
                images: { orderBy: { order: 'asc' } },
                category: true,
                supplier: {                     
                    select: {
                        id: true,
                        nomeFantasia: true,
                        logo: true,
                        ratingAverage: true,
 
                    }
                },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        buyer: { select: { name: true } }
                    }
                }
            }
        });

        if (!product) {
            req.flash('error_msg', 'Produto não encontrado ou indisponível.');
            return res.redirect('/catalog');
        }

        const otherProductsFromSupplier = await prisma.product.findMany({
            where: {
                supplierId: product.supplierId,
                isActive: true,
                id: { not: product.id }
            },
            take: 4,
            include: {
                images: { take: 1, orderBy: { order: 'asc' } }
            }
        });

        res.render('catalog/product-id', {
            title: product.name,
            layout: 'layout/main',
            product,
            otherProducts: otherProductsFromSupplier,
            reviews: product.reviews,
        });

    } catch (error) {
        console.error("Erro ao carregar página do produto:", error);
        next(error);
    }
};