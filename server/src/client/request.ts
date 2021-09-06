import { Request as ExpressRequest } from 'express';
import { UserDTO } from '../service/dto/user.dto';

export interface Request extends ExpressRequest {
    user?: UserDTO;
}
