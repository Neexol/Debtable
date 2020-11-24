package ru.neexol.debtable

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
fun Application.module() {
    install(DefaultHeaders) {
        header("Access-Control-Allow-Origin", "*")
    }
    routing {
        route("/text") {
            get {
                val textResponse = "Hello world!"
                call.respondText(textResponse)
            }
            post("/{text}") {
                val textParameter = call.parameters["text"]!!
                call.respondText(textParameter)
            }
        }
        route("/json") {
            get {
                val rawJsonResponse = """{"text":"Hello world!"}"""
                call.respondText(rawJsonResponse, ContentType.Application.Json)
            }
            post {
                val bodyJson = call.receiveText()
                call.respondText(bodyJson, ContentType.Application.Json)
            }
        }
    }
}

