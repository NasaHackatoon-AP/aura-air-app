import api from '../lib/api';

interface createUser {
    nome: string;
    email: string;
    senha: string;
    data_nascimento: string;
    cidade: string;
    estado: string;
}

export const createUser = async (user: createUser) => {
    const response = await api.post('/airquality/usuario', user);
    return response.data;
}