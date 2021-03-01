import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import UsersRepository from "../repositories/UsersRepository";
import * as yup from 'yup';
import AppError from "../errors/AppError";

class UserController {

    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().max(10).required(),
            email: yup.string().email().required()
        });

        // if (!(await schema.isValid(request.body))) {
        //     return response.status(400).json({error: "Validation Failed"});
        // }

        try {
            await schema.validate(request.body);
        } catch (error) {
            if (error.type == 'max') {
                throw new AppError("O campo nome pode ter no máximo 10 caracteres!");
                //return response.status(400).json({error: "O campo nome pode ter no máximo 10 caracteres!"})
            }
            return response.status(400).json({error: error})
        }

        const userRepository = getCustomRepository(UsersRepository)

        const userAlreadyExists = await userRepository.findOne({
            email
        })

        if(userAlreadyExists) {
            throw new AppError("Usuário já cadastrado");
            //return response.status(400).json({error: "Usuário já cadastrado"})
        }

        const user = userRepository.create({
            name,
            email
        })

        await userRepository.save(user)
        
        return response.status(201).json(user)
    }
}

export default UserController