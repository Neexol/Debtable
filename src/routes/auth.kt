package ru.neexol.debtable.routes

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.sessions.*
import io.ktor.util.*
import org.jetbrains.exposed.exceptions.ExposedSQLException
import ru.neexol.debtable.auth.DebtableSession
import ru.neexol.debtable.auth.JwtService
import ru.neexol.debtable.auth.hashFunction
import ru.neexol.debtable.models.requests.RegisterUserRequest
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.exceptions.UserNotFoundException
import ru.neexol.debtable.utils.exceptions.WrongPasswordException
import ru.neexol.debtable.utils.interceptJsonBodyError

@KtorExperimentalAPI
fun Route.auth() {
    route("/auth") {
        register()
        login()
    }
}

@KtorExperimentalAPI
private fun Route.register() {
    post("/register") {
        runCatching {
            val request = call.receive<RegisterUserRequest>()
            val newUser = UsersRepository.addUser(
                request.username,
                request.displayName,
                hashFunction(request.password)
            )

            call.sessions.set(DebtableSession(newUser.id.value))
            JwtService.generateToken(newUser)
        }.fold(
            onSuccess = { call.respondText(it) },
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

@KtorExperimentalAPI
private fun Route.login() {
    post("/login") {
        runCatching {
            val request = call.receive<RegisterUserRequest>()
            val user = UsersRepository.findUserByUserName(request.username) ?: throw UserNotFoundException()
            if (user.passwordHash != hashFunction(request.password)) {
                throw WrongPasswordException()
            }

            call.sessions.set(DebtableSession(user.id.value))
            JwtService.generateToken(user)
        }.fold(
            onSuccess = { call.respondText(it) },
            onFailure = { exception ->
                if (!interceptJsonBodyError(exception)) {
                    when (exception) {
                        is UserNotFoundException -> call.respond(
                            HttpStatusCode.NotFound,
                            "There is no user with this username."
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