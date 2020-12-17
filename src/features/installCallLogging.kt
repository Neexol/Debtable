package ru.neexol.debtable.features

import io.ktor.application.*
import io.ktor.features.*
import org.slf4j.event.Level

fun Application.installCallLogging() {
    install(CallLogging) {
        level = Level.INFO
    }
}