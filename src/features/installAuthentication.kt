package ru.neexol.debtable.features

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import ru.neexol.debtable.auth.JwtService
import ru.neexol.debtable.repositories.UsersRepository

fun Application.installAuthentication() {
    install(Authentication) {
        jwt("jwt") {
            verifier(JwtService.verifier)
            realm = "Debtable Server"
            validate {
                val claim = it.payload.getClaim("id").asInt()
                UsersRepository.getUserById(claim)
            }
        }
    }
}