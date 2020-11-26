package ru.neexol.debtable.features

import io.ktor.application.*
import io.ktor.sessions.*
import ru.neexol.debtable.auth.DebtableSession

fun Application.installSessions() {
    install(Sessions) {
        cookie<DebtableSession>("MY_SESSION") {
            cookie.extensions["SameSite"] = "lax"
        }
    }
}