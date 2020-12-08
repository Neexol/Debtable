package ru.neexol.debtable.routes.auth

import de.nielsfalk.ktor.swagger.*
import de.nielsfalk.ktor.swagger.version.shared.Group
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.sessions.*
import io.ktor.util.*
import org.jetbrains.exposed.exceptions.ExposedSQLException
import ru.neexol.debtable.auth.DebtableSession
import ru.neexol.debtable.auth.JwtService
import ru.neexol.debtable.auth.hashFunction
import ru.neexol.debtable.models.requests.LoginUserRequest
import ru.neexol.debtable.models.requests.RegisterUserRequest
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.routes.API
import ru.neexol.debtable.utils.exceptions.NotFoundException
import ru.neexol.debtable.utils.exceptions.WrongPasswordException
import ru.neexol.debtable.utils.foldRunCatching
import ru.neexol.debtable.utils.interceptJsonBodyError
import ru.neexol.debtable.utils.jsonBodyErrors
import ru.neexol.debtable.utils.unauthorized

const val API_AUTH = "$API/auth"
const val API_AUTH_REGISTER = "$API_AUTH/register"
const val API_AUTH_LOGIN = "$API_AUTH/login"

@Group("Auth")
@KtorExperimentalLocationsAPI
@Location(API_AUTH_REGISTER) class ApiAuthRegisterRoute
@Group("Auth")
@KtorExperimentalLocationsAPI
@Location(API_AUTH_LOGIN) class ApiAuthLoginRoute

@KtorExperimentalLocationsAPI
@KtorExperimentalAPI
fun Route.authRoute() {
    registerEndpoint()
    loginEndpoint()
}

@KtorExperimentalLocationsAPI
@KtorExperimentalAPI
private fun Route.registerEndpoint() {
    post<ApiAuthRegisterRoute, RegisterUserRequest>(
        "Register new user"
            .examples(
                example("Register account example", RegisterUserRequest.EXAMPLE)
            )
            .responds(
                ok<String>(
                    example("Access token example", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXRoZW50aWNhdGlvbiIsImlzcyI6ImRlYnRhYmxlU2VydmVyIiwiaWQiOjEyLCJleHAiOjE2MDcwODQzNjd9.W_MFXUC1-Hyeild-C9y1t1t_758yleob9o2n1RvVRgKin_xGfulmqpcrucrzvUSJmC9BrWkpGY7zrr0z6NY8DQ", description = "Success.")
                ),
                *jsonBodyErrors,
                HttpCodeResponse(HttpStatusCode.Conflict, listOf(), "User with this username already exists.")
            )
    ) { _, request ->
        foldRunCatching(
            block = {
                val newUser = UsersRepository.addUser(
                    request.username,
                    request.displayName,
                    hashFunction(request.password)
                )

                call.sessions.set(DebtableSession(newUser.id.value))
                JwtService.generateToken(newUser)
            },
            onSuccess = { result ->
                call.respondText(result)
            },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is ExposedSQLException -> call.respond(
                            HttpStatusCode.Conflict,
                            "User with this username already exists."
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
@KtorExperimentalAPI
private fun Route.loginEndpoint() {
    post<ApiAuthLoginRoute, LoginUserRequest>(
        "Login"
            .examples(
                example("Login example", LoginUserRequest.EXAMPLE)
            )
            .responds(
                ok<String>(
                    example("Access token example", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXRoZW50aWNhdGlvbiIsImlzcyI6ImRlYnRhYmxlU2VydmVyIiwiaWQiOjEyLCJleHAiOjE2MDcwODQzNjd9.W_MFXUC1-Hyeild-C9y1t1t_758yleob9o2n1RvVRgKin_xGfulmqpcrucrzvUSJmC9BrWkpGY7zrr0z6NY8DQ", description = "Success.")
                ),
                *jsonBodyErrors,
                notFound(description = "User not found."),
                unauthorized("Wrong password.")
            )
    ) { _, request ->
        foldRunCatching(
            block = {
                val user = UsersRepository.getUserByUserName(request.username) ?: throw NotFoundException()
                if (user.passwordHash != hashFunction(request.password)) {
                    throw WrongPasswordException()
                }

                call.sessions.set(DebtableSession(user.id.value))
                JwtService.generateToken(user)
            },
            onSuccess = { result ->
                call.respondText(result)
            },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is NotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "User not found."
                        )
                        is WrongPasswordException -> call.respond(
                            HttpStatusCode.Unauthorized,
                            "Wrong password."
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