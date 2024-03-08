package com.example.toolmanagingsystem.repository;

import com.example.toolmanagingsystem.entity.Punch;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PunchRepository extends JpaRepository<Punch, Long>, JpaSpecificationExecutor<Punch>
{
    static Specification<Punch> filter(String startDate, String endDate, String type, String supplier, String status, String location, String product, String ptype) {
        return new Specification<Punch>() {
            @Override
            public Predicate toPredicate(Root<Punch> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                Predicate result = criteriaBuilder.conjunction();
                if (startDate != null) {
                    result = criteriaBuilder.and(result, criteriaBuilder.greaterThanOrEqualTo(root.get("registerDate"), startDate));
                }
                if (endDate != null) {
                    result = criteriaBuilder.and(result, criteriaBuilder.lessThanOrEqualTo(root.get("registerDate"), endDate));
                }
                if (type != null) {
                    result = criteriaBuilder.and(result, criteriaBuilder.equal(root.get("type"), type));
                }
                if (supplier != null) {
                    result = criteriaBuilder.and(result, criteriaBuilder.equal(root.get("supplier"), supplier));
                }
                if (status != null) {
                    result = criteriaBuilder.and(result, criteriaBuilder.equal(root.get("status"), status));
                }
                if (location != null) {
                    result = criteriaBuilder.and(result, criteriaBuilder.equal(root.get("location"), location));
                }
                if (product != null) {
                    result = criteriaBuilder.and(result, criteriaBuilder.equal(root.get("product"), product));
                }
                if (ptype != null) {
                    result = criteriaBuilder.and(result, criteriaBuilder.equal(root.get("ptype"), ptype));
                }
                return result;
            }
        };
    }
}
