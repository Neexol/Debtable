package ru.neexol.debtable.utils

import ru.neexol.debtable.models.responses.PurchaseResponse

class StatsString(stats: String) {

    private val statsMap = mutableMapOf<Int, Float>().also { statsMap ->
        stats.ifEmpty { return@also }
        stats.split(";").forEach {
            val split = it.split(":")
            statsMap[split[0].toInt()] = split[1].toFloat()
        }
    }

    fun addPurchase(purchase: PurchaseResponse) {
        purchase.debtors.forEach { debtor ->
            statsMap[purchase.buyer.id] = statsMap[purchase.buyer.id]!! + purchase.debt
            statsMap[debtor.id] = statsMap[debtor.id]!! - purchase.debt
        }
    }

    fun editPurchase(oldPurchase: PurchaseResponse, newPurchase: PurchaseResponse) {
        removePurchase(oldPurchase)
        addPurchase(newPurchase)
    }

    fun removePurchase(purchase: PurchaseResponse) {
        purchase.debtors.forEach { debtor ->
            statsMap[purchase.buyer.id] = statsMap[purchase.buyer.id]!! - purchase.debt
            statsMap[debtor.id] = statsMap[debtor.id]!! + purchase.debt
        }
    }

    fun addUserBalance(userId: Int) {
        statsMap[userId] ?: run {
            statsMap[userId] = 0f
        }
    }

    fun removeUserBalance(userId: Int) = statsMap.remove(userId)

    override fun toString() = toList().joinToString(";") { "${it.first}:${it.second}" }

    fun toList() = statsMap.toList()
}