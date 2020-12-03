package ru.neexol.debtable.routes

import io.ktor.auth.*
import io.ktor.locations.*
import io.ktor.routing.*
import io.ktor.util.*
import ru.neexol.debtable.routes.account.accountRoute
import ru.neexol.debtable.routes.auth.authRoute
import ru.neexol.debtable.routes.users.usersRoute

const val API = "/api"

@KtorExperimentalLocationsAPI
@KtorExperimentalAPI
fun Route.apiRoute() {
    authRoute()
    authenticate("jwt") {
        accountRoute()
        usersRoute()
    }
}