import { body } from 'express-validator';
import { handleValidationErrors } from "../middleware/authMiddleware";
import { Request, Response } from 'express';

const baseProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('O nome do produto é obrigatório.'),

    body('description')
        .trim()
        .notEmpty().withMessage('A descrição é obrigatória.'),

    body('price')
        .isFloat({ gt: 0 }).withMessage('O preço deve ser um número maior que zero.')
        .toFloat(), 

    body('stockQuantity')
        .isInt({ min: 0 }).withMessage('O estoque deve ser um número inteiro igual ou maior que zero.')
        .toInt(),

    body('categoryId')
        .notEmpty().withMessage('A categoria é obrigatória.')
        .isString().withMessage('ID de categoria deve ser uma string.')
        .isLength({ min: 10 }).withMessage('ID de categoria inválido.'),

    body('unit')
        .notEmpty().withMessage('A unidade de medida é obrigatória.'),
];


export const validateCreateProduct = [
    ...baseProductValidation, 
    
    body('images').custom((value, { req }) => {
        if (!req.files || !('images' in req.files) || req.files.images.length === 0) {
            throw new Error('Pelo menos uma imagem do produto é obrigatória.');
        }
        return true;
    }),

    handleValidationErrors("/supplier/products/new"),
];

export const validateUpdateProduct = [
    ...baseProductValidation,
    
    (req: any, res: any, next: any) => {
        const redirectUrl = `/supplier/products/${req.params.id}/edit`;
        handleValidationErrors(redirectUrl)(req, res, next);
    }
];
