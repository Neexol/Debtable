package ru.neexol.debtable.routes.account

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.util.*
import ru.neexol.debtable.auth.hashFunction
import ru.neexol.debtable.models.requests.ChangePasswordRequest
import ru.neexol.debtable.models.requests.ChangeUserDataRequest
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.exceptions.NotMatchPasswordException
import ru.neexol.debtable.utils.foldRunCatching
import ru.neexol.debtable.utils.getUserViaToken
import ru.neexol.debtable.utils.interceptJsonBodyError

const val API_ACCOUNT_CHANGE = "$API_ACCOUNT/change"
const val API_ACCOUNT_CHANGE_PASSWORD = "$API_ACCOUNT_CHANGE/password"
const val API_ACCOUNT_CHANGE_DATA = "$API_ACCOUNT_CHANGE/data"

@KtorExperimentalLocationsAPI
@Location(API_ACCOUNT_CHANGE_PASSWORD) class ApiAccountChangePasswordRoute
@KtorExperimentalLocationsAPI
@Location(API_ACCOUNT_CHANGE_DATA) class ApiAccountChangeDataRoute

@KtorExperimentalLocationsAPI
@KtorExperimentalAPI
fun Route.changeRoute() {
    passwordEndpoint()
    dataEndpoint()
}

@KtorExperimentalLocationsAPI
@KtorExperimentalAPI
private fun Route.passwordEndpoint() {
    patch<ApiAccountChangePasswordRoute> {
        foldRunCatching(
            block = {
                val request = call.receive<ChangePasswordRequest>()
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
    patch<ApiAccountChangeDataRoute> {
        foldRunCatching(
            block = {
                val request = call.receive<ChangeUserDataRequest>()
                val user = getUserViaToken()

                UsersRepository.changeUserData(
                    user.id.value,
                    request.displayName
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