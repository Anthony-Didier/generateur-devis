import "reflect-metadata"
import { AppDataSource } from "./data-source"
import { Article } from "./entities/Article"

AppDataSource.initialize()
    .then(async () => {
        AppDataSource.query("TRUNCATE TABLE article");

        const article1 = new Article();
        article1.name = "Jus d'orange (1 l)";
        article1.tax = 10;
        article1.price = 2.09;
        await AppDataSource.manager.save(article1);

        console.log("Article", article1.name, "has been saved with id :", article1.id)

        const article2 = new Article();
        article2.name = "Cidre (75 cl)";
        article2.tax = 20;
        article2.price = 2.50;
        await AppDataSource.manager.save(article2);

        console.log("Article", article2.name, "has been saved with id :", article2.id)

        console.log("Loading articles from the database...")
        const articles = await AppDataSource.manager.find(Article)
        console.log("Loaded articles: ", articles)
    })
    .catch((error) => console.log("Error: ", error))