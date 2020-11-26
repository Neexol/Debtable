package ru.neexol.debtable

import io.ktor.application.*
import io.ktor.routing.*
import ru.neexol.debtable.features.installGson
import ru.neexol.debtable.features.installHeaders
import ru.neexol.debtable.routes.filesRoute

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused")
fun Application.module() {
    installHeaders()
    installGson()

    routing {
        filesRoute()
        route("/api") {

        }
    }
}

