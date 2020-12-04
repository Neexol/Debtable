package ru.neexol.debtable.utils

import com.google.gson.JsonSyntaxException
import de.nielsfalk.ktor.swagger.HttpCodeResponse
import de.nielsfalk.ktor.swagger.badRequest
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.util.pipeline.*

suspend fun PipelineContext<*, ApplicationCall>.interceptJsonBodyError(e: Throwable): Boolean {
    when (e) {
        is UnsupportedMediaTypeException -> call.respond(
            HttpStatusCode.UnsupportedMediaType,
            "Wrong body."
        )
        is JsonSyntaxException -> call.respond(
            HttpStatusCode.BadRequest,
            "Syntax error in json."
        )
        is NullPointerException -> call.respond(
            HttpStatusCode.UnprocessableEntity,
            "Lexical error in json."
        )
        else -> return false
    }
    return true
}
