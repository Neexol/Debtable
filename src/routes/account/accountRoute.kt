package ru.neexol.debtable.routes.account

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.util.*
import ru.neexol.debtable.auth.hashFunction
import ru.neexol.debtable.models.requests.ChangePasswordRequest
import ru.neexol.debtable.models.requests.ChangeUserDataRequest
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.routes.API
import ru.neexol.debtable.utils.exceptions.NotMatchPasswordException
import ru.neexol.debtable.utils.foldRunCatching
import ru.neexol.debtable.utils.getUserViaToken
import ru.neexol.debtable.utils.interceptJsonBodyError
import ru.neexol.debtable.utils.jsonBodyErrors

const val API_ACCOUNT = "$API/account"
const val API_ACCOUNT_CHANGE = "$API_ACCOUNT/change"
const val API_ACCOUNT_CHANGE_PASSWORD = "$API_ACCOUNT_CHANGE/password"
const val API_ACCOUNT_CHANGE_DATA = "$API_ACCOUNT_CHANGE/data"

@Group("Account")
@KtorExperimentalLocationsAPI
@Location(API_ACCOUNT_CHANGE_PASSWORD) class ApiAccountChangePasswordRoute
@Group("Account")
@KtorExperimentalLocationsAPI
@Location(API_ACCOUNT_CHANGE_DATA) class ApiAccountChangeDataRoute

@KtorExperimentalLocationsAPI
@KtorExperimentalAPI
fun Route.accountRoute() {
    passwordEndpoint()
    dataEndpoint()
}

@KtorExperimentalLocationsAPI
@KtorExperimentalAPI
private fun Route.passwordEndpoint() {
    patch<ApiAccountChangePasswordRoute, ChangePasswordRequest>(
        "Change password"
            .examples(
                example("Change password example", ChangePasswordRequest.example)
            )
            .responds(
                noContent(description = "Success."),
                *jsonBodyErrors,
                HttpCodeResponse(HttpStatusCode.Forbidden, listOf(), "Old password is wrong.")
            )
    ) { _, request ->
        foldRunCatching(
            block = {
                val user = getUserViaToken()
                if (user.passwordHash != hashFunction(request.oldPassword)) {
                    throw NotMatchPasswordException()
                }

                UsersRepository.changePassword(
                    user.id.value,
                    hashFunction(request.newPassword)
                )
            },
            onSuccess = {
                call.respond(HttpStatusCode.NoContent)
            },
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

@KtorExperimentalLocationsAPI
private fun Route.dataEndpoint() {
    patch<ApiAccountChangeDataRoute, ChangeUserDataRequest>(
        "Change data"
            .examples(
                example("Change data example", ChangeUserDataRequest.example)
            )
            .responds(
                noContent(description = "Success."),
                *jsonBodyErrors,
            )
    ) { _, request ->
        foldRunCatching(
            block = {
                val user = getUserViaToken()

                UsersRepository.changeUserData(
                    user.id.value,
                    request.newDisplayName
                )
            },
            onSuccess = {
                call.respond(HttpStatusCode.NoContent)
            },
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