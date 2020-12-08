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
import ru.neexol.debtable.utils.foldRunCatching
import ru.neexol.debtable.utils.getUserIdFromToken
import ru.neexol.debtable.utils.unauthorized

const val API_USERS = "$API/users"
const val API_USERS_ME = "$API_USERS/me"

@Group("Users")
@KtorExperimentalLocationsAPI
@Location(API_USERS_ME) class ApiUsersMeRoute
@Group("Users")
@KtorExperimentalLocationsAPI
@Location(API_USERS) data class ApiUsersRoute(val username: String)

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
                    example("User example", UserResponse.EXAMPLES[0], description = "Success.")
                ),
                badRequest(description = "Other errors."),
                unauthorized()
            )
    ) {
        foldRunCatching(
            block = {
                UsersRepository.getUserById(getUserIdFromToken())!!
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
        "Get users by username"
            .responds(
                ok<UserResponse>(
                    example("Users example", UserResponse.EXAMPLES, description = "Success.")
                ),
                unauthorized(),
                badRequest(description = "Other errors.")
            )
    ) { route ->
        foldRunCatching(
            block = {
                UsersRepository.getUsersByUserName(route.username)
            },
            onSuccess = { result ->
                call.respond(result.map { UserResponse(it) })
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