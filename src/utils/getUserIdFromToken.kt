package ru.neexol.debtable.utils

import io.ktor.application.*
import io.ktor.sessions.*
import io.ktor.util.pipeline.*
import ru.neexol.debtable.auth.DebtableSession
import ru.neexol.debtable.utils.exceptions.unauthorized.WrongTokenException

fun PipelineContext<*, ApplicationCall>.getUserIdFromToken() =
    call.sessions.get<DebtableSession>()?.userId ?: throw WrongTokenException()