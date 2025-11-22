import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import slugify from 'slugify';
import { randomBytes } from 'crypto';
import { Prisma } from '../../prisma/.prisma/generated';

export const GetProduts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = res.locals.user?.company?.id;
        
        if (!companyId) {
            req.flash('error_msg', 'Não foi possível identificar sua empresa.');
            return res.redirect('/supplier/dashboard');
        }

        const products = await prisma.product.findMany({
            where: { 
                supplierId: companyId 
            },
            orderBy: { 
                createdAt: 'desc' 
            },
            include: {
                category: {
                    select: { name: true }
                },

                images: {
                    take: 1,
                    orderBy: { order: 'asc' },
                    select: { url: true }
                },
                
            }
        });

        res.render('supplier/products', {
            title: 'Meus Produtos',
            layout: 'layout/dashboard',
            products: products
        });

    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        next(error);
    }
};

export const getCreateProdutc = async (req: Request, res: Response, next: NextFunction) => {

    const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });

    res.render('supplier/createProd', { 
        title: 'Adicionar Novo Produto',
        layout: 'layout/dashboard',
        categories: categories
    });

}


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const companyId = res.locals.user?.company?.id;

        if (!companyId) {
            req.flash('error_msg', 'Sua empresa não foi encontrada. Faça login novamente.');
            return res.redirect('/auth/login');
        }

        const {
            name,
            description,
            price,
            stockQuantity,
            categoryId,
            unit,
            ncm,
            imageUrls
        } = req.body;

        const baseSlug = slugify(name, { lower: true, strict: true });
        const randomSuffix = randomBytes(4).toString('hex');
        const slug = `${baseSlug}-${randomSuffix}`;

        const newProduct = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price,
                stockQuantity,
                unit,
                ncm: ncm || null,
                isActive: true,
                supplier: {
                    connect: { id: companyId }
                },
                category: {
                    connect: { id: categoryId }
                },
                images: {
                    create: imageUrls.split(',').map((url: string, index: number) => ({
                        url: url.trim(),
                        order: index,
                        isPrimary: index === 0
                    }))
                }
            }
        });
        
        req.flash('success_msg', `Produto "${newProduct.name}" criado com sucesso!`);
        res.redirect('/supplier/products');

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        next(error);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const companyId = res.locals.user?.company?.id;

        if (!id || typeof id !== 'string') {
            req.flash('error_msg', 'ID do produto inválido.');
            return res.redirect('/supplier/products');
        }

        const product = await prisma.product.findFirst({
            where: {
                id: id,
                supplierId: companyId
            }
        });

        if (!product) {
            req.flash('error_msg', 'Produto não encontrado ou você não tem permissão para excluí-lo.');
            return res.redirect('/supplier/products');
        }

        await prisma.product.delete({
            where: { id: id }
        });

        req.flash('success_msg', `Produto "${product.name}" foi excluído com sucesso.`);
        res.redirect('/supplier/products');

    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        next(error);
    }
};


export const getEditProductForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const companyId = res.locals.user?.company?.id;

        if (!id || typeof id !== 'string') {
            req.flash('error_msg', 'ID do produto inválido.');
            return res.redirect('/supplier/products');
        }

        const product = await prisma.product.findFirst({
            where: {
                id: id,
                supplierId: companyId 
                
            },
            include: {
                images: true,
                category: true
            }
        });

        if (!product) {
            req.flash('error_msg', 'Produto não encontrado.');
            return res.redirect('/supplier/products');
        }

        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });

        res.render('supplier/editProd', {
            title: `Editar Produto: ${product.name}`,
            layout: 'layout/dashboard',
            product, 
            categories 
        });

    } catch (error) {
        console.error("Erro ao carregar formulário de edição:", error);
        next(error);
    }
};



export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: productId } = req.params;
        const companyId = res.locals.user?.company?.id;

        if (productId == null || companyId == null){
            return res.redirect('/');
        };

        const productOwnerCheck = await prisma.product.findFirst({
            where: { id: productId, supplierId: companyId }
        });

        if (!productOwnerCheck) {
            req.flash('error_msg', 'Operação não permitida.');
            return res.redirect('/supplier/products');
        }

        const {
            name,
            description,
            price,
            stockQuantity,
            categoryId,
            unit,
            ncm,
            isActive
        } = req.body;

        const dataToUpdate: Prisma.ProductUpdateInput = {
            name,
            description,
            price: parseFloat(price),
            stockQuantity: parseInt(stockQuantity, 10),
            unit,
            ncm: ncm || null,
            isActive: isActive === 'on',
            category: { connect: { id: categoryId } },
        };

        if (name !== productOwnerCheck.name) {
            const baseSlug = slugify(name, { lower: true, strict: true });
            const randomSuffix = randomBytes(4).toString('hex');
            dataToUpdate.slug = `${baseSlug}-${randomSuffix}`;
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };


        if (files.images && files.images.length > 0) {
            dataToUpdate.images = {
                deleteMany: {},
                create: files.images.map((file, index) => ({
                    url: `/uploads/images/${file.filename}`,
                    order: index,
                    isPrimary: index === 0
                }))
            };
        }

        if (files.manual && files.manual.length > 0) {
            dataToUpdate.technicalManualUrl = `/uploads/manuals/${files.manual[0]!.filename}`;
        }

        await prisma.product.update({
            where: { id: productId },
            data: dataToUpdate
        });

        req.flash('success_msg', `Produto "${name}" atualizado com sucesso!`);
        res.redirect(`/supplier/products/${productId}/edit`);

    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        next(error);
    }
};