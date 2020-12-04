package ru.neexol.debtable.utils

import de.nielsfalk.ktor.swagger.HttpCodeResponse
import de.nielsfalk.ktor.swagger.badRequest
import io.ktor.http.*

val jsonBodyErrors = arrayOf(
    HttpCodeResponse(HttpStatusCode.UnsupportedMediaType, listOf(), "Wrong body."),
    badRequest(description = "Syntax error in json or other errors."),
    HttpCodeResponse(HttpStatusCode.UnprocessableEntity, listOf(), "Lexical error in json.")
)

fun unauthorized(): HttpCodeResponse = HttpCodeResponse(HttpStatusCode.Unauthorized, listOf(), "Wrong token.")
fun forbidden(): HttpCodeResponse = HttpCodeResponse(HttpStatusCode.Forbidden, listOf(), "Access denied.")