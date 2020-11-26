package ru.neexol.debtable

import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.content.*
import io.ktor.routing.*
import io.ktor.util.*
import ru.neexol.debtable.db.DatabaseFactory
import ru.neexol.debtable.features.*
import ru.neexol.debtable.routes.auth

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@KtorExperimentalAPI
@Suppress("unused")
fun Application.module() {
    DatabaseFactory.init()

    installCallLogging()
    installSessions()
    installAuthentication()
    installContentNegotiation()
    installDefaultHeaders()

    routing {
        static {
            resources("front")
        }
        route("/api") {
            auth()
        }
    }
}

