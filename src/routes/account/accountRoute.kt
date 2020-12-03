package ru.neexol.debtable.routes.account

import io.ktor.locations.*
import io.ktor.routing.*
import io.ktor.util.*
import ru.neexol.debtable.routes.API

const val API_ACCOUNT = "$API/account"

@KtorExperimentalLocationsAPI
@KtorExperimentalAPI
fun Route.accountRoute() {
    changeRoute()
}
