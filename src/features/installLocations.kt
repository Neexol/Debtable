package ru.neexol.debtable.features

import io.ktor.application.*
import io.ktor.locations.*

fun Application.installLocations() {
    install(Locations)
}