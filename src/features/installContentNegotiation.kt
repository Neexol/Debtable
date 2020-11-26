package ru.neexol.debtable.features

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.gson.*

fun Application.installContentNegotiation() {
    install(ContentNegotiation) {
        gson {
            setPrettyPrinting()
        }
    }
}