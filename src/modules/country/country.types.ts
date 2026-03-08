
export type Country = {
    id: number;
    name: string;
    capital?: string;
    currency?: string;
}

// DTO para crear un nuevo país. Este tipo se puede usar para validar la entrada de datos en el controlador.
export type CreateCountryDTO = {
    name: string;
    capital?: string | undefined; // esto es para que si no viene el campo, sea undefined, pero si viene, debe ser string. Porque con zod, si es opcional, entonces puede ser string o undefined, pero si no viene, entonces es undefined. Entonces, con esta transformacion, hago que si no viene, sea undefined, pero si viene, debe ser string.
    currency?: string | undefined; // lo mismo que el capital, pero para la moneda.
}