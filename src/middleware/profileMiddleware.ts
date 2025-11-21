import { Request, Response, NextFunction } from 'express';


export const checkProfileOwnership = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const loggedInUserId = res.locals.user?.id;
    const loggedInUserCompanyId = res.locals.user?.company?.id;

    // Assume que não é o dono por padrão
    res.locals.isOwner = false;

    if (loggedInUserCompanyId && id === loggedInUserCompanyId) {
        res.locals.isOwner = true;
    }

    next();
};
