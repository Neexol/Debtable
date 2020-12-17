package ru.neexol.debtable.features

import io.ktor.application.*
import io.ktor.features.*

fun Application.installDefaultHeaders() {
    install(DefaultHeaders) {
        header("Access-Control-Allow-Origin", "*")
    }
}