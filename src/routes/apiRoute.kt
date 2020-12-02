package ru.neexol.debtable.routes

import io.ktor.auth.*
import io.ktor.routing.*
import io.ktor.util.*
import ru.neexol.debtable.routes.account.accountRoute
import ru.neexol.debtable.routes.auth.authRoute
import ru.neexol.debtable.routes.users.usersRoute

@KtorExperimentalAPI
fun Route.apiRoute() {
    route("/api") {
        authRoute()
        authenticate("jwt") {
            accountRoute()
            usersRoute()
        }
    }
}