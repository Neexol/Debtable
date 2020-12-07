package ru.neexol.debtable.utils

import de.nielsfalk.ktor.swagger.HttpCodeResponse
import de.nielsfalk.ktor.swagger.badRequest
import io.ktor.http.*

val jsonBodyErrors = arrayOf(
    HttpCodeResponse(HttpStatusCode.UnsupportedMediaType, listOf(), "Wrong body."),
    badRequest(description = "Syntax error in json or other errors."),
    HttpCodeResponse(HttpStatusCode.UnprocessableEntity, listOf(), "Lexical error in json.")
)

fun unauthorized(description: String = "Wrong token.") = HttpCodeResponse(HttpStatusCode.Unauthorized, listOf(), description)
fun forbidden(description: String = "Access denied.") = HttpCodeResponse(HttpStatusCode.Forbidden, listOf(), description)