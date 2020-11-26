package ru.neexol.debtable.routes

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.sessions.*
import ru.neexol.debtable.auth.DebtableSession
import ru.neexol.debtable.models.responses.UserResponse
import ru.neexol.debtable.repositories.UsersRepository

fun Route.user() {
    route("/user") {
        whoami()
        change()
    }
}

private fun Route.change() {
    route("/change") {
        password()
        displayName()
    }
}

private fun Route.whoami() {
    get("/whoami") {
        val user = call.sessions.get<DebtableSession>()?.let {
            UsersRepository.findUserById(it.userId)
        }!!
        call.respond(UserResponse(user))
    }
}

private fun Route.password() {
    post("/password") {

    }
}

private fun Route.displayName() {
    post("/display-name") {

    }
}