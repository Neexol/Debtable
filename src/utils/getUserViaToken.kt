package ru.neexol.debtable.utils

import io.ktor.application.*
import io.ktor.sessions.*
import io.ktor.util.pipeline.*
import ru.neexol.debtable.auth.DebtableSession
import ru.neexol.debtable.repositories.UsersRepository

suspend fun PipelineContext<*, ApplicationCall>.getUserViaToken() = call.sessions.get<DebtableSession>()?.let {
    UsersRepository.findUserById(it.userId)
}!!