package ru.neexol.debtable.routes.users

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.routes.API
import ru.neexol.debtable.utils.exceptions.IncorrectQueryException
import ru.neexol.debtable.utils.exceptions.UserNotFoundException
import ru.neexol.debtable.utils.foldRunCatching
import ru.neexol.debtable.utils.getUserViaToken
import java.lang.NumberFormatException

const val API_USERS = "$API/users"
const val API_USERS_ME = "$API_USERS/me"

@KtorExperimentalLocationsAPI
@Location(API_USERS) class ApiUsersRoute(val id: Int? = null, val username: String? = null)
@KtorExperimentalLocationsAPI
@Location(API_USERS_ME) class ApiUsersMeRoute

@KtorExperimentalLocationsAPI
fun Route.usersRoute() {
    meEndpoint()
    findEndpoint()
}

@KtorExperimentalLocationsAPI
private fun Route.meEndpoint() {
    get<ApiUsersMeRoute> {
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

@KtorExperimentalLocationsAPI
private fun Route.findEndpoint() {
    get<ApiUsersRoute> { apiUsersRoute ->
        foldRunCatching(
            block = {
                apiUsersRoute.id?.let { id ->
                    UsersRepository.findUserById(id) ?: throw UserNotFoundException()
                } ?: apiUsersRoute.username?.let { username ->
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
                    else -> call.respond(
                        HttpStatusCode.BadRequest,
                        exception.toString()
                    )
                }
            }
        )
    }
}