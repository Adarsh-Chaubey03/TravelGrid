import compression from "compression";
import hpp from "hpp";
import express from "express";


export const stabilityMiddleware = (app) => {

    app.use(
        hpp({
            whitelist: ['page', 'limit', 'sort', 'filter'],
        })
    );


    app.use(
        compression({
            level: 6,
            threshold: 1024,
            filter: (req, res) => {
                const type = res.getHeader("Content-Type") || "";
                if (/image|video|zip|pdf/.test(type)) return false;
                return true;
            },
        })
    );


    app.use(
        express.json({
            limit: "1mb",
        })
    );

    app.use(
        express.urlencoded({
            limit: "1mb",
            extended: true,
        })
    );



    app.use((req, res, next) => {
        res.setHeader("X-App-Stability", "active");
        next();
    });


}