package ru.neexol.debtable.routes.users

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
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
import ru.neexol.debtable.utils.getUserFromToken
import ru.neexol.debtable.utils.unauthorized

const val API_USERS = "$API/users"
const val API_USERS_ME = "$API_USERS/me"

@Group("Users")
@KtorExperimentalLocationsAPI
@Location(API_USERS_ME) class ApiUsersMeRoute
@Group("Users")
@KtorExperimentalLocationsAPI
@Location(API_USERS) data class ApiUsersRoute(val id: Int? = null, val username: String? = null)

@KtorExperimentalLocationsAPI
fun Route.usersRoute() {
    meEndpoint()
    findEndpoint()
}

@KtorExperimentalLocationsAPI
private fun Route.meEndpoint() {
    get<ApiUsersMeRoute>(
        "Get current user"
            .responds(
                ok<UserResponse>(
                    example("User example", UserResponse.example, description = "Success.")
                ),
                badRequest(description = "Other errors."),
                unauthorized()
            )
    ) {
        foldRunCatching(
            block = {
                getUserFromToken()
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
    get<ApiUsersRoute>(
        "Get user by id or username"
            .responds(
                ok<UserResponse>(
                    example("User example", UserResponse.example, description = "Success.")
                ),
                notFound(description = "There is no user with this id/username."),
                badRequest(description = "Incorrect query or other errors."),
                unauthorized()
            )
    ) { apiUsersRoute ->
        foldRunCatching(
            block = {
                apiUsersRoute.id?.let { id ->
                    UsersRepository.getUserById(id) ?: throw UserNotFoundException()
                } ?: apiUsersRoute.username?.let { username ->
                    UsersRepository.getUserByUserName(username) ?: throw UserNotFoundException()
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