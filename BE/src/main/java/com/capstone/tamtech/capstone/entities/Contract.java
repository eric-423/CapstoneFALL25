package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "contract")
@Data
@NoArgsConstructor
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_id")
    private int id;

    @Column(name = "contract_start_date")
    private Date startDate;

    @Column(name = "contract_end_date")
    private Date endDate;

    @Column(name = "contract_status")
    private boolean status;

    @Column(name = "contract_ref_link")
    private String refLink;

    @Column(name = "contract_term")
    private String term;

    @ManyToOne( cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @ManyToOne( cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "user_id")
    private Users user;

}
