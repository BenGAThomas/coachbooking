import { config } from "dotenv";

config(
    {
        path: `.env.${process.env.NODE_ENV || 'development'}.local`
    }
)

export const { PORT, NODE_ENV, MongoDB_URI} = process.env