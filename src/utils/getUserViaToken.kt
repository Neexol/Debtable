package ru.neexol.debtable.utils

import io.ktor.application.*
import io.ktor.sessions.*
import io.ktor.util.pipeline.*
import ru.neexol.debtable.auth.DebtableSession
import ru.neexol.debtable.db.entities.User
import ru.neexol.debtable.repositories.UsersRepository
import ru.neexol.debtable.utils.exceptions.WrongTokenException

suspend fun PipelineContext<*, ApplicationCall>.getUserViaToken(): User {
    return call.sessions.get<DebtableSession>()?.let {
        UsersRepository.getUserById(it.userId)
    } ?: throw WrongTokenException()
}