package ru.neexol.debtable.routes.users

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.exceptions.IncorrectQueryException
import ru.neexol.debtable.utils.exceptions.UserNotFoundException
import ru.neexol.debtable.utils.foldRunCatching
import ru.neexol.debtable.utils.getUserViaToken
import java.lang.NumberFormatException

fun Route.usersRoute() {
    route("/users") {
        meEndpoint()
        findEndpoint()
    }
}

private fun Route.meEndpoint() {
    get("/me") {
        foldRunCatching(
            block = {
                getUserViaToken()
            },
            onSuccess = { result ->
                call.respond(UserResponse(result))
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

private fun Route.findEndpoint() {
    get {
        foldRunCatching(
            block = {
                val params = call.request.queryParameters
                val id = params["id"]?.toInt()
                val username = params["username"]

                id?.let {
                    UsersRepository.findUserById(id) ?: throw UserNotFoundException()
                } ?: username?.let {
                    UsersRepository.findUserByUserName(username) ?: throw UserNotFoundException()
                } ?: throw IncorrectQueryException()
            },
            onSuccess = { result ->
                call.respond(UserResponse(result))
            },
            onFailure = { exception ->
                when (exception) {
                    is UserNotFoundException -> call.respond(
                        HttpStatusCode.NotFound,
                        "There is no user with this id/username."
                    )
                    is IncorrectQueryException -> call.respond(
                        HttpStatusCode.BadRequest,
                        "Incorrect query."
                    )
                    is NumberFormatException -> call.respond(
                        HttpStatusCode.UnprocessableEntity,
                        "Id must be a number."
                    )
                    else -> call.respond(
                        HttpStatusCode.BadRequest,
                        exception.toString()
                    )
                }
            }
        )
    }
}