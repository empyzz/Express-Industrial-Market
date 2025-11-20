import { body, validationResult } from 'express-validator'
import { handleValidationErrors } from "../middleware/authMiddleware";


export const validateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('O nome do produto é obrigatório.'),

    body('description')
        .trim()
        .notEmpty().withMessage('A descrição é obrigatória.'),

    body('price')
        .isFloat({ gt: 0 }).withMessage('O preço deve ser um número maior que zero.')
        .toFloat(), // Converte para número

    body('stockQuantity')
        .isInt({ min: 0 }).withMessage('O estoque deve ser um número inteiro igual ou maior que zero.')
        .toInt(),

    body('categoryId')
        .notEmpty().withMessage('A categoria é obrigatória.')
        .isString().withMessage('ID de categoria deve ser uma string.')
        .isLength({ min: 10 }).withMessage('ID de categoria inválido.'),

    body('unit')
        .notEmpty().withMessage('A unidade de medida é obrigatória.'),

    body('imageUrls')
        .notEmpty().withMessage('Pelo menos uma imagem é obrigatória.'),

    handleValidationErrors("/supplier/products"),
];