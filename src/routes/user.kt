package ru.neexol.debtable.routes

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.util.*
import ru.neexol.debtable.auth.hashFunction
import ru.neexol.debtable.models.requests.ChangePasswordRequest
import ru.neexol.debtable.models.requests.ChangeUserDataRequest
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.exceptions.NotMatchPasswordException
import ru.neexol.debtable.utils.getUserViaToken
import ru.neexol.debtable.utils.interceptJsonBodyError

@KtorExperimentalAPI
fun Route.user() {
    route("/user") {
        whoami()
        change()
    }
}

@KtorExperimentalAPI
private fun Route.change() {
    route("/change") {
        password()
        data()
    }
}

private fun Route.whoami() {
    get("/whoami") {
        runCatching {
            UserResponse(getUserViaToken())
        }.fold(
            onSuccess = { call.respond(it) },
            onFailure = { exception ->
                call.respond(
                    HttpStatusCode.BadRequest,
                    exception.toString()
                )
            }
        )
    }
}

@KtorExperimentalAPI
private fun Route.password() {
    post("/password") {
        runCatching {
            val request = call.receive<ChangePasswordRequest>()
            val user = getUserViaToken()
            if (user.passwordHash != hashFunction(request.oldPassword)) {
                throw NotMatchPasswordException()
            }

            UsersRepository.changePassword(
                user.id.value,
                hashFunction(request.newPassword)
            )
        }.fold(
            onSuccess = { call.respond(HttpStatusCode.NoContent) },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is NotMatchPasswordException -> call.respond(
                            HttpStatusCode.Forbidden,
                            "Old password is wrong."
                        )
                        else -> call.respond(
                            HttpStatusCode.BadRequest,
                            exception.toString()
                        )
                    }
                }
            }
        )
    }
}

private fun Route.data() {
    post("/data") {
        runCatching {
            val request = call.receive<ChangeUserDataRequest>()
            val user = getUserViaToken()

            UsersRepository.changeUserData(
                user.id.value,
                request.displayName
            )
        }.fold(
            onSuccess = { call.respond(HttpStatusCode.NoContent) },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        exception.toString()
                    )
                }
            }
        )
    }
}