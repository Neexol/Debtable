package ru.neexol.debtable.features

import de.nielsfalk.ktor.swagger.SwaggerSupport
import de.nielsfalk.ktor.swagger.version.shared.Contact
import de.nielsfalk.ktor.swagger.version.shared.Information
import de.nielsfalk.ktor.swagger.version.v2.Swagger
import de.nielsfalk.ktor.swagger.version.v3.OpenApi
import io.ktor.application.*

fun Application.installSwagger() {
    install(SwaggerSupport) {
        path = "api/docs"
        val information = Information(
            version = "0.1",
            title = "Debtable API",
            contact = Contact(
                name = "Nikita Alexeev",
                url = "https://www.github.com/Neexol",
                email = "almostroll@yandex.ru"
            )
        )
        swagger = Swagger().apply {
            info = information
        }
        openApi = OpenApi().apply {
            info = information
        }
    }
}