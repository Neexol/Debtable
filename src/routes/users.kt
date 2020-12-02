package ru.neexol.debtable.routes

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.utils.foldRunCatching
import ru.neexol.debtable.utils.getUserViaToken

fun Route.users() {
    route("/users") {
        me()
    }
}

private fun Route.me() {
    get("/me") {
        foldRunCatching(
            block = {
                UserResponse(getUserViaToken())
            },
            onSuccess = { result ->
                call.respond(result)
            },
            onFailure = { exception ->
                call.respond(
                    HttpStatusCode.BadRequest,
                    exception.toString()
                )
            }
        )
    }
}